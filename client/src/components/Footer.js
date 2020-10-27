import { Grid, Typography } from '@material-ui/core'
import React from 'react'

const Footer = () => {
    return (
        <Grid className="footer" justify="center" alignItems="center" container>
            <Typography
            variant="body1"
            paragraph
            >
                Copyright &copy; Dev-SetUps  
            </Typography>
        </Grid>
    )
}

export default Footer
