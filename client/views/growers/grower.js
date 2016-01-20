import React from 'react'

export default ({grower}) => {
  const {email, id, location, name, smallImage, url} = grower

  return <div className='panel panel-default product'>
    <div className='panel-heading'>
      <h3 className='panel-title'>
        <a href={`/growers/${id}`}>{name}</a>
      </h3>
    </div>
    <div className='panel-body'>
      <div className='media'>
        <div className='media-left media-middle'>
          <div className='image-wrapper'>
            <a href={`/growers/${id}`}>
              <img className='img-rounded' src={smallImage} style={{maxWidth: '100px', maxHeight: '100px'}}/>
            </a>
          </div>
        </div>
        <div className='media-body'>
          {email ? <a href={`mailto:${email}`} target='_blank'>{email}</a> : '' }
          {email && url ? <br/> : ''}
          {url ? <a href={url} target='_blank'>{url}</a> : ''}
          {location && (email || url) ? <br/> : ''}
          {location || ''}
        </div>
      </div>
    </div>
  </div>
}