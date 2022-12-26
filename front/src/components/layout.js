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
    <>
      <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
      <Container>
      </Container>
        <main>{children}</main>
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
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
