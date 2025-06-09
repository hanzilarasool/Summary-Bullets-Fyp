const SucessAnimation = () => {
  return (
    <div className="w-[218px] h-[188px] relative">
      <div className="w-[134px] h-[134px] left-[40px] top-[31px] absolute bg-gradient-to-r from-emerald-100 to-emerald-500 rounded-full flex justify-center items-center animate-zoom-in">
        <div className="check-background flex justify-center items-center w-[90px] pb-[8px] animate-zoom-in-delay-2">
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask id="checkMask">
              <rect width="100" height="100" fill="white" />
              <path
                d="M30 50L45 65L70 35"
                stroke="black"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </mask>
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="white"
              mask="url(#checkMask)"
            />
          </svg>
        </div>
      </div>
      <div className="w-[21px] h-[21px] left-[197px] top-[47px] absolute bg-gradient-to-r from-emerald-100 to-emerald-500 rounded-full animate-zoom-in-delay-1" />
      <div className="w-[15px] h-[15px] left-0 top-[107px] absolute bg-gradient-to-r from-emerald-100 to-emerald-500 rounded-full animate-zoom-in-delay-1" />
      <div className="w-2.5 h-2.5 left-[40px] top-[173px] absolute bg-gradient-to-r from-emerald-100 to-emerald-500 rounded-full animate-zoom-in-delay-2" />
      <div className="w-2.5 h-2.5 left-[164px] top-[163px] absolute bg-gradient-to-r from-emerald-100 to-emerald-500 rounded-full animate-zoom-in-delay-2" />
      <div className="w-1.5 h-1.5 left-[185px] top-[118px] absolute bg-gradient-to-r from-emerald-100 to-emerald-500 rounded-full animate-zoom-in-delay-2" />
      <div className="w-2 h-2 left-[107px] top-0 absolute bg-gradient-to-r from-emerald-100 to-emerald-500 rounded-full animate-zoom-in-delay-3" />
      <div className="w-[5px] h-[5px] left-[103px] top-[183px] absolute bg-gradient-to-r from-emerald-100 to-emerald-500 rounded-full animate-zoom-in-delay-3" />
      <div className="w-[30px] h-[30px] left-[10px] top-[10px] absolute bg-gradient-to-r from-emerald-100 to-emerald-500 rounded-full animate-zoom-in-delay-1" />
      <div className="w-[54px] h-[54px] left-[79.50px] top-[71px] absolute" />
    </div>
  );
};

export default SucessAnimation;
