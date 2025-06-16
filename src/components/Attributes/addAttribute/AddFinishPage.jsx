import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '@/components/common/Layout';
import CommonAddForm from '@/components/common/CommonAddForm';
// import { fetchFinishById, addFinish, updateFinish } from '@/redux/slice/finish/colorThunks';
import { getFinishById, addFinish, updateFinish} from '@/redux/slice/finish/finishThunks';
import { toast } from 'react-toastify';

const AddFinishPage = ({ onSubmit }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode, id } = useParams();
  const isEdit = mode === 'edit';

  const { selectedFinish, loading } = useSelector(state => state.finish);

  useEffect(() => {
    if (isEdit && id) {
      dispatch(getFinishById(id));
    }
  }, [dispatch, isEdit, id]);

  const handleSubmit = async values => {
    const payload = { finish: values.name };

    try {
      if (isEdit) {
        await dispatch(updateFinish({ id, data: payload })).unwrap();
      } else {
        if (onSubmit) {
          await onSubmit(values);
        } else {
          await dispatch(addFinish(payload)).unwrap();
        }
      }

      if (!onSubmit) {
        navigate('/admin/finish', {
          state: {
            toastMessage: isEdit ? 'Finish updated successfully!' : 'Finish added successfully!',
          },
        });
      }
    } catch (error) {
      console.error('Failed to submit finish:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        (typeof error === 'string' ? error : 'Failed to save finish.');

      toast.error(errorMessage);
    }
  };

  if (isEdit && loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <Layout title="Finish" isEdit={isEdit}>
      <CommonAddForm
        label="Finish Name"
        buttonText={isEdit ? 'Update Finish' : 'Add Finish'}
        initialValues={{ name: selectedFinish?.finish || '' }}
        onSubmit={handleSubmit}
      />
    </Layout>
  );
};

export default AddFinishPage;
