import SideImage from "./SideImage";
import Header from "./Header";
interface SignLayoutProps {
  children: React.ReactNode;
}
const SignLayout: React.FC<SignLayoutProps> = ({ children }) => {
  return (
    <div className="bg-[#dfd4bf] h-[calc(100vh - 400px)]">
      <Header />
      <div className="flex gap-2 border border-black mx-4 mt-5 mb-2 p-5">
        <SideImage />
        <main className="flex-1 flex flex-col">{children}</main>
        <SideImage />
      </div>
    </div>
  );
};

export default SignLayout;
