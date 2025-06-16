import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '@/components/common/Layout';
import CommonAddForm from '@/components/common/CommonAddForm';
// import { fetchFinishById, addFinish, updateFinish } from '@/redux/slice/finish/colorThunks';
import { getFinishById, addFinish, updateFinish} from '@/redux/slice/finish/finishThunks';
import { toast } from 'react-toastify';

const AddFinishPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode, id } = useParams();
  const isEdit = mode === 'edit';

  const { selectedFinish, loading, error } = useSelector(state => state.finish);
console.log(selectedFinish);

  useEffect(() => {
    if (isEdit && id) {
      dispatch(getFinishById(id));
    }
  }, [dispatch, isEdit, id]);

  const initialValues = useMemo(() => {
    if (isEdit && selectedFinish) {
      return { name: selectedFinish.finish || '' };
    }
    return { name: '' };
  }, [isEdit, selectedFinish]);

  const handleSubmit = async values => {
    const payload = { finish: values.name };

    try {
      if (isEdit) {
        await dispatch(updateFinish({ id, data: payload })).unwrap();
        toast.success('Finish updated successfully!');
      } else {
        await dispatch(addFinish(payload)).unwrap();
        toast.success('Finish added successfully!');
      }

      navigate('/admin/finish', {
        state: {
          toastMessage: isEdit ? 'Finish updated successfully!' : 'Finish added successfully!',
        },
      });
    } catch (err) {
      console.error('Failed to submit:', err);
      toast.error(err?.message || 'Failed to save Finish.');
    }
  };

  if (isEdit && loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <Layout title="Finish" isEdit={isEdit}>
      <CommonAddForm
        label="Finish Name"
        buttonText={isEdit ? 'Update Finish' : 'Add Finish'}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
    </Layout>
  );
};

export default AddFinishPage;
