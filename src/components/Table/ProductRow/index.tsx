import {Chip} from "@mui/material";
import React from "react";
import {CustomRowProps} from "../../../types/table";
import {StyledTableCell, StyledTableRow} from "../styles";
import EditButton from "../../EditButton";
import {parseISO, format} from "date-fns";

const ProductsRow: React.FC<CustomRowProps> = ({row}) => {
  const {id, title, price, published, createdAt} = row;
  return (
    <StyledTableRow>
      <StyledTableCell component='th' scope='row' align='center'>
        {id}
      </StyledTableCell>
      <StyledTableCell align='center'>{title}</StyledTableCell>
      <StyledTableCell align='center'>
        <Chip clickable label={`${price.toLocaleString()} $`} variant='filled' />
      </StyledTableCell>
      <StyledTableCell align='center'>
        {published ? (
          <Chip clickable label='Yes' color='success' variant='filled' />
        ) : (
          <Chip clickable label='No' color='error' variant='filled' />
        )}
      </StyledTableCell>
      <StyledTableCell align='center'>{`${format(parseISO(createdAt), "MM/dd/yyyy")}`}</StyledTableCell>
      <StyledTableCell align='center'>
        <EditButton id={id} nameOfEditingItem={"product"}>
          Edit
        </EditButton>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default ProductsRow;