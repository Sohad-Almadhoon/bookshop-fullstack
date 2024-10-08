import { Link } from "react-router-dom";

const SocialMedia = () => {
  const socialLogIn = [
    {
      icon: "/assets/Discord.png",
      link: "#",
    },
    {
      icon: "/assets/Google.png",
      link: "#",
    },
    {
      icon: "/assets/Meta.png",
      link: "#",
    },
    // {
    //   label: "connect with metamask",
    //   icon: "/assets/discord.svg",
    //   link: "#",
    // },
    // {
    //   label: "connect with google",
    //   icon: "/assets/metamask.svg",
    //   link: "#",
    // },
  ];
  return (
    <ul className="flex gap-3 w-[300px] items-center justify-center mx-auto mb-5 flex-1">
      {socialLogIn.map((social) => {
        return (
          <li key={social.icon} className="text-center">
            <Link to={social.link}>
              <img src={social.icon} alt={social.icon} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default SocialMedia;
