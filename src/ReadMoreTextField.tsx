import { useRecordContext } from 'react-admin';
import { useState } from 'react';

const ReadMoreTextField = ({ source, length = 200 }) => {
    const record = useRecordContext();
    const [expanded, setExpanded] = useState(false);
  
    const text = record[source];
    const shouldTruncate = text && text.length > length;
    const truncatedText = text ? text.slice(0, length) + '...' : '';
  
    return (
      <div style={{ 
        minWidth: '300px',
        width: '100%',
        maxWidth: '100%',
        wordWrap: 'break-word',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <span style={{ 
          display: 'block',
          whiteSpace: 'pre-wrap',
          width: '100%'
        }}>
          {shouldTruncate && !expanded ? truncatedText : text}
        </span>
        {shouldTruncate && (
          <button 
            onClick={() => setExpanded(!expanded)}
            style={{
              alignSelf: 'flex-start',
              marginLeft: '0px',
              background: 'none',
              border: 'none',
              color: '#1976d2',
              cursor: 'pointer',
              padding: '4px 0'
            }}
          >
            {expanded ? 'Read Less' : 'Read More'}
          </button>
        )}
      </div>
    );
};
export default ReadMoreTextField;
