// importing the required chakra libraries
import { theme as chakraTheme } from '@chakra-ui/react'
import { extendTheme } from "@chakra-ui/react"

// declare a variable for fonts and set our fonts. I am using Inter with various backups but you can use `Times New Roman`. Note we can set different fonts for the body and heading.
const theme  = { 
fonts: {
    //heading: 'Display fonts',
    //body: 'Display fonts',
  },
  styles: {
    global: {
      // styles for the `body`
      body: {
        bg: 'white',
        color: 'black',
      },
      // styles for the `a`
      a: {
        color: '#1d57a5',
        _hover: {
          textDecoration: 'underline',
        },
      },
    },
  },}

// declare a variable for our theme and pass our overrides in the e`xtendTheme` method from chakra
const customTheme = extendTheme(theme)

// export our theme
export default customTheme