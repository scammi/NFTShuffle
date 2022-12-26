/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import Header from "./header"
import "./layout.css"
import image from '../../public/bk_color_vertical.svg'

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <Box sx={{ backgroundImage: `url(${image})`, aspectRatio: '1/1.09', height: '100%', width: '100%', backgroundRepeat: 'none', backgroundSize: 'cover' }}>
      <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
      <Container >
        <main>{children}</main>
      </Container>
        <Box sx={{
        position: 'relative',
        top: 650,
        width: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        height: '20px',
        backgroundColor: 'Black'
       }}
      > 
      </Box>
    </Box>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
