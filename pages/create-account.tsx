import {useRouter} from "next/router";
import React, {useState} from "react";
import {useForm} from "react-hook-form";

interface IForm {
  name: string;
  email: string;
  password: string;
  avatar: string;
}

export default () => {
  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm<IForm>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onValid = async (data: IForm) => {
    if (!loading) {
      setLoading(true);
      const request = await fetch("/api/users/create-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (request.status === 200) {
        alert("Account already exists! Please log in!");
      }
      if (request.status === 201) {
        alert("Account created! Please log in!");
      }
      if (request.status !== 405) {
        router.push("/login");
      }

      setLoading(false);
    }
  };
  return (
    <div className="max-w-xl mx-auto px-10 py-5 flex items-center h-screen align-stretch">
      <div className="flex-1 flex flex-col">
        <svg className="w-8 h-8 mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
          <path d="M7.548 21.501c9.056 0 14.01-7.503 14.01-14.01 0-.213 0-.425-.015-.636A10.02 10.02 0 0 0 24 4.305a9.815 9.815 0 0 1-2.828.775 4.94 4.94 0 0 0 2.165-2.723 9.865 9.865 0 0 1-3.127 1.195 4.929 4.929 0 0 0-8.391 4.491A13.98 13.98 0 0 1 1.67 2.898a4.928 4.928 0 0 0 1.525 6.573A4.88 4.88 0 0 1 .96 8.855v.063a4.926 4.926 0 0 0 3.95 4.826 4.914 4.914 0 0 1-2.223.085 4.93 4.93 0 0 0 4.6 3.42A9.88 9.88 0 0 1 0 19.288a13.941 13.941 0 0 0 7.548 2.208" fill="#1DA1F2" />
        </svg>
        <h1 className="text-3xl font-bold mb-8">계정을 생성하세요</h1>
        <form onSubmit={handleSubmit(onValid)} className="space-y-6 flex-1">
          <div>
            <input
              className="py-3 px-1 border rounded w-full"
              type="text"
              placeholder={'이름'}
              {...register("avatar", {required: "이름을 입력해 주세요."})}
            />
            <div className="absolute text-xs text-red-400">{errors?.name?.message}</div>
          </div>
          <div>
            <input
              className="py-3 px-1 border rounded w-full"
              type="text"
              placeholder={'이름'}
              {...register("name", {required: "이름을 입력해 주세요."})}
            />
            <div className="absolute text-xs text-red-400">{errors?.name?.message}</div>
          </div>
          <div>
            <input
              className="py-3 px-1 border rounded w-full"
              type="email"
              placeholder={'이메일'}
              {...register("email", {required: "이메일을 입력해 주세요."})}
            />
            <div className="absolute text-xs text-red-400">{errors?.email?.message}</div>
          </div>
          <div>
            <input
              className="py-3 px-1 border rounded w-full"
              type="password"
              placeholder={'비밀번호'}
              {...register("password", {required: "비밀번호를 입력해 주세요."})}
            />
            <div className="absolute text-xs text-red-400">{errors?.password?.message}</div>
          </div>
          <div className="pt-10">
            <button className="rounded-full font-bold text-white bg-blue-400 py-3 px-1 border w-full">
              가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
