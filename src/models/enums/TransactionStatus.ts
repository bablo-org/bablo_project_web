export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
}

export const getStatusString = (status: TransactionStatus) => {
  switch (status) {
    case TransactionStatus.PENDING:
      return 'Pending';
    case TransactionStatus.COMPLETED:
      return 'Completed';
    case TransactionStatus.APPROVED:
      return 'Approved';
    case TransactionStatus.DECLINED:
      return 'Declined';
    default:
      return 'Unknown';
  }
};

export const getStatusColor = (status: TransactionStatus) => {
  switch (status) {
    case TransactionStatus.PENDING:
      return 'orange';
    case TransactionStatus.COMPLETED:
      return 'black';
    case TransactionStatus.APPROVED:
      return 'green';
    case TransactionStatus.DECLINED:
      return 'red';
    default:
      return 'black';
  }
};
