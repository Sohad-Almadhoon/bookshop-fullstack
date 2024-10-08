import Header from "../shared/Header";
import SideImage from "./SideImage";
interface SignLayoutProps {
  children: React.ReactNode;
}
const SignLayout: React.FC<SignLayoutProps> = ({ children }) => {
  return (
    <div className=" bg-background  h-[calc(100vh - 400px)]">
      <Header />
      <div className="flex gap-2 border border-black mx-4 mt-5 mb-2 p-5">
        <SideImage />
        <main className="flex-1 grow flex flex-col">{children}</main>
        <SideImage />
      </div>
    </div>
  );
};

export default SignLayout;
