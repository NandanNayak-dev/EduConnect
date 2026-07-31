import PropTypes from "prop-types";

import NavBar from "./NavBar";

const PublicRoute = ({ children }) => {
  return (
    <div>
      <NavBar />
      {children}
    </div>
  );
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
