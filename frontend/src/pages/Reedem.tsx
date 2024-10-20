import Header from "../components/shared/Header";

const Reedem = () => {

  return (
    <div className="min-h-screen">
      <Header
        title={
          <h1 className="text-3xl">
            REDEEM <span className="text-2xl">REDEEM YOUR TOKENS</span>
          </h1>
        }
      />
      <div className="min-h-screen border border-black flex justify-center items-center w-full">
        <img
          src="/assets/USD.png"
          alt=""
          className="max-w-xl w-full object-cover"
        />
      </div>
     
    </div>
  );
};

export default Reedem;
