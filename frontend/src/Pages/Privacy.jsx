import { useState, useEffect } from "react";
import config from "../config";
import ShowBook from "./ShowBook";
const Privacy = () => {
  const [privacy, setPrivacy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await fetch(`${config.API_URL}/api/v1/getprivacy`);
        if (!response.ok) {
          throw new Error("Failed to fetch privacy data");
        }
        const data = await response.json();
        setPrivacy(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching privacy policy:", error);
        setPrivacy({ content: "Privacy policy not found." });
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, []);

  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }
  return (
    <div className="self-stretch  text-base font-normal font-['Inter'] leading-normal">
      {privacy ? (
        <div className="py-12 flex-col justify-start sm:px-[90px] px-[16px] items-start gap-8 inline-flex">
          <div className="flex-col justify-start items-start gap-2 flex">
            <div className="text-slate-800 text-[40px] font-semibold font-['Inter']">
              Privacy Policy
            </div>

            <div className="text-gray-500 text-base font-normal font-['Inter']">
              by SummaryBullets.com
            </div>
          </div>
          <div style={{ maxWidth: "100%", overflow: "hidden" }}>
            <ShowBook initialContent={privacy.content} />
          </div>
        </div>
      ) : (
        <div className="my-[100px] flex-col items-center flex justify-center">
          <p className="text-slate-600 text-[25px] font-semibold font-['Inter']">
            404 Not Found
          </p>
        </div>
      )}
    </div>
  );
};

export default Privacy;
