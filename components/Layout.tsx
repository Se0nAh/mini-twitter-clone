import React from "react";
import Link from "next/link";
import {useRouter} from "next/router";
import useUser from "../lib/useUser";

interface LayoutProps {
  title?: string;
  canGoBack?: boolean;
  children: React.ReactNode;
}

function Layout({
                  title,
                  canGoBack,
                  children,
                }: LayoutProps) {
  const router = useRouter();
  const onClickPrev = () => {
    router.back()
  }
  const { user } = useUser();
  return !user ? <></> : (
    <div className="h-screen mx-auto flex max-w-3xl">
      <div className="w-20 flex flex-col items-center justify-between flex-none">
          <Link href={'/'}>
            <div className="p-4 block cursor-pointer">
              <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                <path d="M7.548 21.501c9.056 0 14.01-7.503 14.01-14.01 0-.213 0-.425-.015-.636A10.02 10.02 0 0 0 24 4.305a9.815 9.815 0 0 1-2.828.775 4.94 4.94 0 0 0 2.165-2.723 9.865 9.865 0 0 1-3.127 1.195 4.929 4.929 0 0 0-8.391 4.491A13.98 13.98 0 0 1 1.67 2.898a4.928 4.928 0 0 0 1.525 6.573A4.88 4.88 0 0 1 .96 8.855v.063a4.926 4.926 0 0 0 3.95 4.826 4.914 4.914 0 0 1-2.223.085 4.93 4.93 0 0 0 4.6 3.42A9.88 9.88 0 0 1 0 19.288a13.941 13.941 0 0 0 7.548 2.208" fill="#1DA1F2" />
              </svg>
            </div>
          </Link>
        <div className="p-4">
          <img
            className="w-10 h-10 rounded-full bg-gray-400 mr-3"
            src={user.avatar || 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png'}
            alt={`${user.name} profile`}/>
        </div>
      </div>
      <div className="flex-1 border-r border-l border-gray-100 flex flex-col align-stretch ">
        <div className="flex items-center space-x-4 h-14 px-4">
          {canGoBack && <button onClick={onClickPrev} className="p-2 mr-2 hover:bg-gray-100 rounded-full">
              <svg className="h-5 w-5"
                   fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                   xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"></path>
              </svg>
          </button>}
          <div className="font-extrabold text-xl">{title}</div>
        </div>
        <div className="h-screen overflow-y-scroll">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout;