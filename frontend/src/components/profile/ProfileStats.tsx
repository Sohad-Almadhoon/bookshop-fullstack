interface ProfileStatsProps {
  following: number;
  followers: number;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  following,
  followers,
}) => (
  <>
    <p className="flex gap-2">
      <b>{following}</b>
      <span>Following</span>
    </p>
    <p className="flex gap-2">
      <b>{followers}</b>
      <span>Follower</span>
    </p>
  </>
);

export default ProfileStats;