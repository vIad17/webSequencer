import Melody from 'src/components/Melody/Melody';

import './OldMain.scss';

interface OldMainProps {
  className?: string;
}

const OldMain = ({ className = '' }: OldMainProps) => (
  <main className={`old-main ${className}`}>
    <Melody />
  </main>
);

export default OldMain;
