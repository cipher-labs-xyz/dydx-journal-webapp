const TimeInfo = ({ createdAt, closedAt }: { createdAt: Date, closedAt: Date | undefined}) => {
  const closed = closedAt || new Date()
  const minutes = Math.floor((closed.getTime() - createdAt.getTime())/60000);
  const hours = Math.floor(minutes/60);
  const days = Math.floor(hours/24);

  return (
    <>
    <p>Open: {open.toLocaleString()}</p>
    { closedAt ? <p>Close: {closed.toLocaleString()}</p> : undefined}
    <p>Total: {days ? `${days}d ` : ''}{hours ? `${hours}h `: ''}{`${minutes}m`}</p>
    </>
  );
};

export {
  TimeInfo
};