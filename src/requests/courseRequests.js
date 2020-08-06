import parseData from 'src/utils/conversionCode';
import { readQuery, mutateQuery } from 'src/utils/API/queryAPI';
import {
  actionSetMenuItem,
  actionSetTopMenuItem,
  actionGetUnitsLessons,
  actionGetPages,
  actionGetSelectedPage,
  actionGetCheckpoints,
  actionGetCompleteSelect,
  actionGetCompletePage,
  actionGetCompleteSelectedPage,
  actionUpdateCompletedLesson,
  actionGetFile,
} from 'src/actions/actions';
import { orderSort } from 'src/utils/utils';

export const parsePage = (page) => {
  page.data = page.data || {}
  page.viewer_data = page.viewer_data || {}
  page.data.root = parseData(page.data.text || '', page.data.blocks || {}, page);
  return page;
}

export const requestFile = (id) => dispatch => {
  return readQuery(`file(id:"${id}")`).then(res => {
    for (var id in res.data.objects) {
      if (res.data.objects[id].type === 'file') {
        dispatch(actionGetFile(res.data.objects[id]));
      }
    }
  });
}

export const completeCurrentPage = (page_id, state, lesson_id, lesson_pages) => dispatch => {
  if (state === 2) {
    mutateQuery(`viewer { complete(to_id:"${page_id}") }`).then();
    if (lesson_id) {
      var completed = lesson_pages.map(page => page.id === page_id || page.viewer_data.complete === 2).filter(Boolean);
      var completed_percent = completed.length / lesson_pages.length;
      mutateQuery(`viewer { complete(to_id:"${lesson_id}" data:"${completed_percent}") }`).then();
    }
  }
  dispatch(actionGetCompleteSelectedPage(state));
  dispatch(actionGetCompletePage(page_id, state));
}

export const requestUnitsLessons = (user_id) => dispatch => {
  const id = "94a40200-42cf-11e8-8238-8ffbb57f2595";
  return readQuery(`curriculum(id:"${id}") { unit { lesson } }`).then(res => {
    var units = [];
    var unit_edges = {};
    res.data.edges.forEach(edge => {
      if (edge.type === 'curriculum/unit') {
        units.push(res.data.objects[edge.to_id]);
      } else if (edge.type === 'unit/lesson') {
        if (!(edge.from_id in unit_edges)) {
          unit_edges[edge.from_id] = [];
        }
        unit_edges[edge.from_id].push(edge);
      }
    });
    for (var ii = 0; ii < units.length; ii++) {
      unit_edges[units[ii].id].sort(orderSort);
      units[ii].lessons = unit_edges[units[ii].id].map(e => res.data.objects[e.to_id]);
    }
    dispatch(actionGetUnitsLessons(units));
    return units;
  });
}

export const requestPrevPage = (page_ids, pages, current_id) => dispatch => {
  var prev = pages[0];
  for (var ii = 1; ii < pages.length; ii++) {
    if (pages[ii].id === current_id) {
      prev = pages[ii - 1];
      break;
    }
  }
  dispatch(actionGetSelectedPage(prev));
}

export const requestNextPage = (page_ids, pages, current_id) => dispatch => {
  var next = pages.length - 1;
  for (var ii = 0; ii < pages.length - 1; ii++) {
    if (pages[ii].id === current_id) {
      next = pages[ii + 1];
      break;
    }
  }
  dispatch(actionGetSelectedPage(next));
}

export const requestLessonAndPagesFromPageID = (id) => dispatch => {
  return readQuery(`page(id:"${id}") { lesson }`).then(res => {
    var lessons = Object.values(res.data.objects || {}).filter(
      object => object.type === 'lesson'
    );
    if (lessons.length > 0) {
      dispatch(actionSetTopMenuItem('library'));
      dispatch(actionSetMenuItem(lessons[0].id));
      dispatch(requestPages(lessons[0].id, id));
      dispatch(requestCheckpoints(lessons[0].id));
    } else {
      var pages = Object.values(res.data.objects || {}).filter(
        object => object.type === 'page'
      );
      var type = 'library';
      if (pages[0].data.is_form) {
        type = 'forms';
      } else if (pages[0].data.is_exam) {
        type = 'exam';
      }
      dispatch(actionSetTopMenuItem(type));
      dispatch(actionGetSelectedPage(pages[0]));
      dispatch(actionGetCheckpoints([]));
      dispatch(actionGetPages([]));
    }
  });
}

export const requestPages = (id, selected_page_id) => dispatch => {
  return readQuery(`lesson(id:"${id}") { page }`).then(pages => {
    var edges = pages.data.edges.filter(e => e.type === 'lesson/page');
    edges.sort(orderSort);
    selected_page_id = selected_page_id || edges[0].to_id;
    var objects = [];
    var selected = null;
    for (var ii = 0; ii < edges.length; ii++) {
      var page = pages.data.objects[edges[ii].to_id];
      objects.push(page);
      if (page.id === selected_page_id) {
        selected = page;
      }
    }
    dispatch(actionGetSelectedPage(selected));
    dispatch(actionGetPages(objects));
    return objects;
  });
}

export const requestSelectedPage = (id) => dispatch => {
  return readQuery(`page(id:"${id}")`).then(res => {
    dispatch(actionGetSelectedPage(res.data.objects[id]));
    return res.data.objects[id];
  });
}

const computeNextCheckpointPage = (checkpoint, pages, previous) => {
  var page_id = pages[0].id;
  if (previous) {
    for (var ii = 0; ii <  pages.length; ii++) {
      if (pages[ii].id === previous.data.page_id) {
        page_id = pages[ii + 1].id;
        break;
      } else if (pages[ii].id === checkpoint.data.page_id) {
        page_id = checkpoint.data.page_id;
        break;
      }
    }
  }
  return page_id;
}

export const requestCheckpoints = (id) => dispatch => {
  return readQuery(`lesson(id:"${id}") { checkpoint }`).then(res => {
    var edges = res.data.edges.filter(e => e.type === 'lesson/checkpoint');
    edges.sort(orderSort);
    var objects = [];
    for (var ii = 0; ii < edges.length; ii++) {
      objects.push(res.data.objects[edges[ii].to_id]);
    }
    dispatch(actionGetCheckpoints(objects));
    return objects;
  });
}
