import React, {PropTypes} from 'react'
import Link from './link'
import {params} from '../url'

const Pagination = ({more, page, url}) => {
  return <div>
    {more
      ? <Link href={params(url, {page: page + 1})} className='pull-xs-right'>
        Next Page →
      </Link>
      : ''
    }
    {page > 1
      ? <Link href={params(url, {page: page - 1})}>
        ← Previous Page
      </Link>
      : ''
    }
  </div>
}

Pagination.propTypes = {
  more: PropTypes.bool,
  page: PropTypes.number,
  url: PropTypes.string
}

export default Pagination
