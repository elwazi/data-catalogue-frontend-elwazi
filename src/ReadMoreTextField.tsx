import { useRecordContext } from 'react-admin';
import { useState } from 'react';

const ReadMoreTextField = ({ source, length = 200 }) => {
    const record = useRecordContext();
    const [expanded, setExpanded] = useState(false);
  
    const text = record[source];
    const shouldTruncate = text && text.length > length;
    const truncatedText = text ? text.slice(0, length) + '...' : '';
  
    return (
      <div>
        {shouldTruncate && !expanded ? truncatedText : text}
        {shouldTruncate && (
          <button onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Read Less' : 'Read More'}
          </button>
        )}
      </div>
    );
  };
export default ReadMoreTextField;
