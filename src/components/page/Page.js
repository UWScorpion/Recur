import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestLessonAndPagesFromPageID, completeCurrentPage } from 'src/requests/courseRequests';
import { actionGetSelectedPage } from 'src/actions/actions';
import HOCPage from 'src/components/page/HOCPage';
import Loading from 'src/components/page/Loading';
import Checkpoints from 'src/components/page/checkpoints/Checkpoints';
import { requestPrevPage, requestNextPage } from 'src/requests/courseRequests';
import PageNav from 'src/components/page/PageNav';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { mutateQuery, escapeData } from 'src/utils/API/queryAPI';
import { withRouter } from "react-router";

export default withRouter(function Page(props) {
  const dispatch = useDispatch();
  const pages = useSelector(state => state.pages);
  const selectedPage = useSelector(state => state.selectedPage);
  const user = useSelector(state => state.session.user);
  const selectedMenuItem = useSelector(state => state.selectedMenuItem);
  const { history } = props;
  const props_id = props.match?.params?.pageID;
  const [pageID, setPageID] = useState(null);

  useEffect(() => {
    if (selectedPage && selectedPage.id === props_id) {
      if (!user?.data?.is_admin) {
        if (selectedPage.data.is_exam) {
          history.push('/platform/exam/');
        }
      }
    }
    if (selectedPage && selectedPage.id !== pageID && pageID) {
      history.push('/platform/page/' + selectedPage.id);
    } else if (selectedPage) {
      if (selectedPage.viewer_data.complete !== 2) {
        var is_complex = false;
        for (var key in (selectedPage.data.blocks || {})) {
          if (key.startsWith('fitb') || key.startsWith('multiple') || key.startsWith('submission')) {
            is_complex = true;
            break;
          }
        }
        if (!is_complex) {
          dispatch(completeCurrentPage(selectedPage.id, 2, selectedMenuItem, pages));
        }
      }
    }
  }, [selectedPage]);

  useEffect(() => {
    setPageID(props_id);
  }, [props_id]);

  useEffect(() => {
    if (pageID && (!selectedPage || selectedPage.id !== pageID)) {
      var found = pages.filter(p => p.id === pageID);
      if (found.length > 0) {
        dispatch(actionGetSelectedPage(found[0]));
      } else {
        dispatch(requestLessonAndPagesFromPageID(pageID));
      }
    }
  }, [pageID]);

  return (
    selectedPage
      ? <div>
          <Checkpoints />
          <Box maxWidth={800} margin="auto">
            <Box pt={2} pb={0}>
              <Typography color="textPrimary" variant="h4">{selectedPage.data.title}</Typography>
            </Box>
            <HOCPage page={selectedPage} />
            <PageNav pages={pages} pageIDs={pages.map(p => p.id)} handlePrevPage={(...p) => dispatch(requestPrevPage(...p))} handleNextPage={(...p) => dispatch(requestNextPage(...p))} />
          </Box>
        </div>
      : <Loading />
  );
});
