import Button from "../components/shared/Button";
import { Link, useNavigate } from "react-router-dom";
import { Heading } from "../components/shared/Header";
import { useEffect } from "react";
import newRequest from '../utils/newRequest';
import { useQuery } from '@tanstack/react-query';

const callWarmup = async () => {
  await newRequest.get('/api/warmup')
}

const LandingPage = () => {
  const navigate = useNavigate();
    useQuery({
    queryKey: ['warmup'],
    queryFn: callWarmup,
  });

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    const token = currentUser ? JSON.parse(currentUser).token : null;

    if (token) {
      navigate("/profile");
    }

  }, [navigate]);

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-[#ddd1bb] font-romie">
      <div className="max-w-3xl py-5 flex justify-center items-center md:flex-1 w-full">
        <div className="relative">
          <img src="/assets/home-circle.svg" alt="" />
          <div className="absolute flex flex-col items-center gap-3 top-1/2  md:top-1/4  inset-0">
            <h1 className="lg:text-9xl  text-7xl mb-2 font-voyage">
              Block{" "}
              <span className="tracking-tighter ">
                B<span className="ml-1 ">o</span>
                <span className="-ml-7">o</span>k
              </span>
            </h1>
            <Heading />
          </div>
          <div className="absolute top-3/4 left-1/2 md:w-[200px]    w-[120px] -ml-[60px]  -mt-3 md:-ml-[95px] md:mt-[25px]">
            <Link to="/login">
              <Button className="p-1 ">login</Button>
            </Link>
            <Link to="/register">
              <Button className="p-1 mt-3" variant="outline">
                sign up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
