import Button from "../shared/Button";

const ProfileActions: React.FC = () => (
  <div className="flex my-4">
    <Button>
      <span></span>BLOCKS <span>3</span>
    </Button>
    <Button className="bg-white text-black border">
      <span></span>FOLLOWING <span>3</span>
    </Button>
  </div>
);
export default ProfileActions;