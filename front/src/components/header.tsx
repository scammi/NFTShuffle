// Frameworks
import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

// MUI
import { Box } from "@mui/material"

// Components
import { MetamaskConnect } from "./MetamaskConnect"

const Header = ({ siteTitle }) => {

  return (
    <Box
      sx={{
        margin: '0 auto',
        padding: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: `none`,
        }}
      >
        {siteTitle}
      </Link>
      <MetamaskConnect />
    </Box>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
