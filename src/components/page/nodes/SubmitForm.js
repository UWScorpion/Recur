import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actionSetFormData } from 'src/actions/actions';

export default (function SubmitForm(props) {
  const { node } = props;
  const dispatch = useDispatch();
  const selectedFormData = useSelector(state => state.selectedFormData);
  const selectedPage = useSelector(state => state.selectedPage);

  useEffect(() => {
    var name = node?.data?.name;
    if (selectedFormData.form_name !== name) {
      dispatch(actionSetFormData({ key: 'form_name', value: name }));
    }
  }, [node]);

  return <></>;
});
