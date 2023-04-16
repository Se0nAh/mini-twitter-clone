import type {NextPage} from "next";
import useSWR from "swr";
import {Tweet, User} from "@prisma/client";
import useUser from "../lib/useUser";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import useMutation from "../lib/useMutation";
import {useRouter} from "next/router";
import Layout from "../components/Layout";
import {cls} from "../lib/utils";
import Link from "next/link";

export interface TweetWithCount extends Tweet {
  text: string;
  user: User;
  _count: {
    like: number;
  };
}

interface TweetsResponse {
  ok: boolean;
  tweets: TweetWithCount[];
}

interface IForm {
  text: string;
}


const Home: NextPage = () => {
  const {user} = useUser();
  const {data, mutate} = useSWR<TweetsResponse>("/api/tweets");
  const [tweet, {loading, data: tweetResult}] = useMutation("/api/tweets");
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    reset
  } = useForm<{ text: string }>();
  const onValid = async (data: IForm) => {
    if (!loading) {
      tweet(data);
    }
  };

  useEffect(() => {
    if (tweetResult && tweetResult.ok) {
      mutate()
      reset()
    }
  }, [tweetResult, router]);

  if (!user) return <></>

  return (
    <Layout title={"홈"}>
      <div className="px-4 flex bg-white border-b border-gray-100 pb-3 ">
        <img
          className="w-12 h-12 rounded-full bg-gray-400 mr-3"
          src={user?.avatar || 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png'}
          alt={`${user?.name} profile`}/>
        <form onSubmit={handleSubmit(onValid)} className="flex-1">
          <div className="py-2">
            <textarea
              className="resize-none text-xl w-full placeholder:text-gray-500 focus:outline-none"
              placeholder="무슨 일이 일어나고 있나요?"
              {...register("text", {required: "Write your text please."})}
            />
          </div>
          <div className="flex justify-end">
            <button
              className={cls("text-white ml-auto py-2 px-5 rounded-full font-bold", watch("text") ? 'bg-blue-400' : 'bg-blue-200')}>
              트윗하기
            </button>
          </div>
        </form>
      </div>
      <div className="">
        {data?.tweets.map((tweet) =>
          <Link href={`/tweet/${tweet.id}`}>
            <div className="flex px-4 py-3 border-b border-gray-100 hover:bg-gray-50 duration-200 cursor-pointer">
              <img
                className="w-12 h-12 rounded-full bg-gray-400 mr-3"
                src={tweet.user?.avatar || 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png'}
                alt={`${tweet.user?.name} profile`}/>
              <div className="pb-3">
                <div>
              <span className="font-bold">
              {tweet.user.name}
              </span>
                  <span className="ml-3 text-gray-500">
                {new Date(tweet.createdAt).toLocaleDateString("ko", {month: 'long', day: 'numeric'})}
              </span>
                </div>
                <div>
                  {tweet.text}
                </div>
              </div>
            </div>
          </Link>

        )}
      </div>
    </Layout>
  );
};

export default Home;
