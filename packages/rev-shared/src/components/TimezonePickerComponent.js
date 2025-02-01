import React from 'react';
import dynamic from 'next/dynamic';
const TimezonePicker = dynamic(import('react-timezone'), { ssr: false });

export default ({ label, value = '', onChange }) => {
  return (
    <React.Fragment>
      <TimezonePicker
        value={value}
        onChange={timezone => onChange(timezone)}
        className="timezone-custom"
        inputProps={{
          placeholder: label,
          name: 'timezone'
        }}
        style={{ zIndex: 1 }}
      />
      <style jsx global>{`
        .timezone-custom {
          width: 100%;
        }

        .timezone-custom ul {
          background-color: #fff !important;
          max-height: 110px !important;
        }

        .timezone-custom input:hover {
          cursor: pointer;
        }
      `}</style>
    </React.Fragment>
  );
};
