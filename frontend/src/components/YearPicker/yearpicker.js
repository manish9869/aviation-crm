import React from "react";
import DatePicker from "react-datepicker";
import PropTypes from "prop-types";
import "react-datepicker/dist/react-datepicker.css";

const YearPicker = ({ selected, onChange }) => {
  const currentYear = new Date().getFullYear();

  // const yearPickerStyle = {
  //   width: "100%",
  //   padding: "0.375rem 0.75rem",
  //   fontSize: "1rem",
  //   lineHeight: "1.5",
  //   color: "#495057",
  //   backgroundColor: "#fff",
  //   backgroundClip: "padding-box",
  //   border: "1px solid #ced4da",
  //   borderRadius: "0.25rem",
  //   transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
  //   outline: "none",
  //   cursor: "pointer",
  // };

  // const yearDropdownStyle = {
  //   backgroundColor: "#f8f9fa",
  //   border: "1px solid #ced4da",
  //   borderRadius: "0.25rem",
  //   boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
  //   padding: "0.5rem",
  //   zIndex: 1,
  // };

  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      showYearPicker
      dateFormat="yyyy"
      yearDropdownItemNumber={10}
      minDate={new Date(1900, 0, 1)}
      maxDate={new Date(currentYear, 11, 31)}
      yearDropdownScrollable
      scrollableYearDropdown
      // yearDropdownStyle={yearDropdownStyle}
      dropdownMode="select"
      yearItemNumber={10}
      // style={yearPickerStyle}
    />
  );
};

YearPicker.propTypes = {
  selected: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default YearPicker;
