import classnames from 'classnames/bind';
import style from './Header.module.scss';

const cx = classnames.bind(style);

/**
 * The main header for a DraCor page — a Bootstrap 4 row wrapper. Its children
 * should be either a string (wrapped in an h1 col) or one or more col divs
 * containing headings.
 */
const Header = ({children, className = ''}) => {
  return (
    <header className={`row ${cx(['main', className])}`}>
      {typeof children === 'string' ? (
        <h1 className="col">{children}</h1>
      ) : (
        children
      )}
    </header>
  );
};

export default Header;
