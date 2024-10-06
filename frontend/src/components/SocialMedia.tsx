import { Link } from "react-router-dom";

const SocialMedia = () => {
  const socialLogIn = [
    {
      label: "connect with discord",
      icon: "/assets/Google.png",
      link: "#",
    },
    {
      label: "connect with discord",
      icon: "/assets/Google.png",
      link: "#",
    },
    {
      label: "connect with discord",
      icon: "/assets/Google.png",
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
          <li key={social.label} className="text-center">
            <Link to={social.link}>
              <img src={social.icon} alt={social.label} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default SocialMedia;
