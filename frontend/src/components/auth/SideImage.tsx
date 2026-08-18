// Decorative column beside the auth forms. Hidden below `lg`, and it no longer
// stacks two `min-h-screen` boxes (which made the auth pages scroll for no
// reason on tablets).
const SideImage = () => (
  <div className="border border-black p-2 hidden lg:block w-40 xl:w-56 shrink-0">
    <div className="border border-black h-full">
      <img
        src="/assets/landing-pattern.svg"
        alt=""
        className="w-full h-full object-cover"
       width={2641} height={1650} />
    </div>
  </div>
);

export default SideImage;
