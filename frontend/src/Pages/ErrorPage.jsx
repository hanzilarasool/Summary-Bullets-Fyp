import { useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  console.error(error);
   if (error.status === 404) {
      return <div className="text-center py-[100px]">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 ">
              404
            </h1>
            <p
              className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl 
              "
            >
              Something is missing.
            </p>
          </div>
        </div>
      </div>;
    }

  return (
    <div className="error-page">
      <h1>Oops! Something went wrong.</h1>
      <p>
        We are sorry, but an unexpected error occurred. Please try refreshing
        the page or come back later.
      </p>
    </div>
  );
}

export default ErrorPage;
