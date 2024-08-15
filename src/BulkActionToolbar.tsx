import { BulkActionToolbar, useListContext, DeleteButton } from 'react-admin';

const CustomBulkActionToolbar = () => {
  const { selectedIds } = useListContext();

  return (
    <BulkActionToolbar>
      {selectedIds.length > 0 ? null : <DeleteButton />}
    </BulkActionToolbar>
  );
};

export default CustomBulkActionToolbar;