import Head from "next/head";

const Home = () => {
  return (
    <>
      <Head>
        <title>Main</title>
      </Head>
      <div className="flex flex-col justify-center items-center">
        <div className="max-w-xs bg-gray-400 py-2 px-8 rounded-md ">
          <p className="text-white">안녕하세요 김창현입니다</p>
        </div>
      </div>
    </>
  );
};

export default Home;
