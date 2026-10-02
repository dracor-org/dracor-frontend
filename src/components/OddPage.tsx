import Header from './Header';
import Footer from './Footer';
import Odd from './Odd';

const OddPage = () => {
  return (
    <div className="w-full px-3.75 mx-auto">
      <title>ODD - DraCor</title>
      <div className="dracor-page">
        <Header>DraCor ODD</Header>
        <Odd />
        <Footer />
      </div>
    </div>
  );
};

export default OddPage;
