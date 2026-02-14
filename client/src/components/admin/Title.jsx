const Title = ({ text1, text2 }) => {
  return (
    <h1 className="text-2xl md:text-3xl font-semibold tracking-wide text-white">
      {text1}{" "}
      <span className="relative inline-block text-primary">
        {text2}
        <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-primary/40 rounded-full"></span>
      </span>
    </h1>
  );
};

export default Title;
