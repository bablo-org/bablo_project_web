import { useMemo } from 'react';
import { auth } from '../../services/firebase';
import {
  useApproveTransation,
  useCompleteTransation,
  useDeclineTransation,
} from '../../queries';
import {
  TransactionStatus,
  getStatusColor,
  getStatusString,
} from '../../models/enums/TransactionStatus';
import User from '../../models/User';
import RenderTransactionItem from '../UI/RenderTransactionItem';

type TransactionItemProps = {
  description: string;
  date: number;
  status: TransactionStatus;
  currency: string;
  amount: number;
  id: string;
  senderId: string;
  recieverId: string;
  users: User[] | undefined;
};
function TransactionItem({
  description,
  date,
  status,
  currency,
  amount,
  id,
  senderId,
  recieverId,
  users,
}: TransactionItemProps) {
  const currentUserId = auth?.currentUser?.uid;

  const showButtonContainer = useMemo(() => {
    return (
      (currentUserId === senderId && status === 'PENDING') ||
      (status === 'APPROVED' && recieverId === currentUserId)
    );
  }, [currentUserId, status, senderId, recieverId]);

  const { mutate: putTransactionsApprove, status: approveStatus } =
    useApproveTransation();
  const { mutate: putTransactionsComplete, status: completeStatus } =
    useCompleteTransation();
  const { mutate: putTransactionsDecline, status: declineStatus } =
    useDeclineTransation();
  const putTransactionsDeclineHandler = () => {
    putTransactionsDecline([id]);
  };

  const putTransactionsCompleteHandler = () => {
    putTransactionsComplete([id]);
  };

  const putTransactionsApproveHandler = () => {
    putTransactionsApprove([id]);
  };

  // a user with whom the current trasaction is
  const secondUser = useMemo(() => {
    if (currentUserId === senderId) {
      return users?.find((user) => user.id === recieverId);
    }
    return users?.find((user) => user.id === senderId);
  }, [users, currentUserId]);

  return (
    <RenderTransactionItem
      avatarId={recieverId}
      avatarUrl={secondUser?.avatar}
      userName={secondUser?.name}
      statusColor={getStatusColor(status)}
      status={getStatusString(status)}
      description={description}
      date={date}
      amountColor={senderId === currentUserId ? 'red' : 'green'}
      amount={`${senderId === currentUserId ? '-' : '+'}${amount} ${currency}`}
      showButtonContainer={showButtonContainer}
      isApprovedStatus={status === 'APPROVED' && recieverId === currentUserId}
      isPendingStatus={currentUserId === senderId && status === 'PENDING'}
      declineStatus={declineStatus === 'loading'}
      declineHandler={putTransactionsDeclineHandler}
      approveStatus={approveStatus === 'loading'}
      approveHandler={putTransactionsApproveHandler}
      completeStatus={completeStatus === 'loading'}
      completeHandler={putTransactionsCompleteHandler}
    />
  );
}

export default TransactionItem;
