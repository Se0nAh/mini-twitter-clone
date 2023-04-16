import type {NextPage} from "next";
import {useRouter} from "next/router";
import useSWR from "swr";
import {Tweet} from "@prisma/client";
import useMutation from "../../lib/useMutation";
import {cls} from "../../lib/utils";

export interface TweetWithCount extends Tweet {
  _count: {
    Like: number;
  };
}

interface TweetDetailResponse {
  ok: boolean;
  tweet: TweetWithCount;
  isLiked: boolean;
}

const ItemDetail: NextPage = () => {
  const router = useRouter();

  const onClickPrev = () => {
    router.push('/')
  }

  const {data, mutate} = useSWR<TweetDetailResponse>(
    router.query.id ? `/api/tweets/${router.query.id}` : null
  );
  const [toggleFav] = useMutation(`/api/tweets/${router.query.id}/like`);
  const onLikeClick = () => {
    if (!data) return;
    toggleFav({});
    mutate((prev) => prev && {...prev, isLiked: !prev.isLiked,
      tweet: {
        ...data?.tweet,
        _count: {
          ...data?.tweet?._count,
          Like: data?.isLiked
            ? data?.tweet?._count?.Like - 1
            : data?.tweet?._count?.Like + 1,
        },
      },}, false);
  };


  return (
    <div className="max-w-3xl border-r border-l border-gray-100 flex flex-col align-stretch h-screen mx-auto">
      {/* header */}
      <div className="flex items-center space-x-4 h-14 px-4">
        <button onClick={onClickPrev} className="p-2 mr-2 hover:bg-gray-100 rounded-full">
          <svg className="h-5 w-5 "
               fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"></path>
          </svg>
        </button>
        <div className="font-extrabold text-xl">트윗</div>
      </div>
      {/* tweet section */}
      <div className="px-4">
        {/* user info */}
        <div className="flex items-center">
          <img
            className="w-12 h-12 rounded-full bg-gray-400 mr-3"
            src={data?.tweet.user.avatar || 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png'}
           alt={`${data?.tweet.user.name} profile`}/>
          <div className="text-lg font-bold">{data?.tweet.user.name}</div>
        </div>

        <div className="mt-3 text-lg">
          {data?.tweet.text}
        </div>

        {data?.tweet.createdAt && <div className="my-4 text-gray-500">
          <span>{new Date(data?.tweet.createdAt).toLocaleTimeString("ko")} </span>
          <span> ・ </span>
          <span> {new Date(data?.tweet.createdAt).toLocaleDateString("ko", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })} </span>
        </div>}

        <div className="py-4 border-t border-gray-100 ">
          <span  className="font-bold mr-1.5">{data?.tweet._count.Like}</span>
          <span className="text-gray-500">마음에 들어요</span>
        </div>

        <div className="py-2 border-t border-gray-100 ">
          <button
            onClick={onLikeClick}
            className={cls(
              "p-2 rounded-full flex items-center hover:bg-red-50 justify-center duration-200 ",
              data?.isLiked
                ? "text-red-500  hover:text-red-600"
                : "text-gray-400  hover:text-red-500"
            )}
          >
            {data?.isLiked ? (
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                ></path>
              </svg>
            ) : (
              <svg
                className="h-6 w-6 "
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;