import { Box } from '@mui/system'


export const CursosLayout = ({ children }) => {

  return (
    <Box sx={{ display: 'flex' }}>
        <Box 
            component='main'
            sx={{ flexGrow: 1, p: 3 }}
        >
            { children }
            
        </Box>
    </Box>
  )
}