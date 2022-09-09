import PageHead from '../components/base/PageHead';
import PageRoutingAnimation from '../components/base/PageRoutingAnimation';

const NotFoundPage = () => (
  <>
    <PageHead title="Not Found" description="KimBiYam의 개발 블로그 입니다." />
    <PageRoutingAnimation>
      <div className="max-w-xl pt-8 mx-auto text-center">
        <p className="mt-24 text-6xl font-bold md:text-8xl">404</p>
        <p className="mt-2 text-3xl font-bold md:text-6xl">Page Not Found</p>
        <p className="mt-6 text-xl">잘못된 경로로 접근하셨습니다.</p>
      </div>
    </PageRoutingAnimation>
  </>
);

export default NotFoundPage;
