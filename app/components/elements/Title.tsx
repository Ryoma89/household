import React from "react";

type TitleProps = {
  title: string;
};

const Title: React.FC<TitleProps> = ({ title }) => {
  return (
    <h2 className="text-4xl text-extrabold text-center">
      <span className="border-b-2 border-accentColor">
        {title}
      </span>
    </h2>
  );
};

export default Title;
