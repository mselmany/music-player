import React, { createContext, useReducer, useMemo, useContext, useCallback, useEffect } from "react";

import { format, differenceInBusinessDays } from "date-fns";
import { tr } from "date-fns/locale";
import { error } from "../commons/utils";

import { getSprints } from "../mock";

const initialState = {
  sprints: [],
  filters: [],
  startAt: 0,
  page: 0,
  isLast: false,
  pending: true,
  selecteds: {
    sprint: null,
    filter: ""
  }
};

function modify(sprints) {
  return sprints.map((item) => {
    const lastDate = item.completeDate || item.endDate;
    item.__computed = {
      isCurrent: false,
      completeDate: format(new Date(lastDate), "dd MMM yy", { locale: tr }),
      endDate: format(new Date(item.endDate), "dd MMM yy", { locale: tr }),
      startDate: format(new Date(item.startDate), "dd MMM yy", { locale: tr }),
      filterTag: format(new Date(lastDate), "MMMM yyyy", { locale: tr }),
      dayLength:
        lastDate && item.startDate ? differenceInBusinessDays(new Date(lastDate), new Date(item.startDate)) : 0,
      timestamp: new Date(lastDate).getTime()
    };
    return item;
  });
}

function sortSprints(p, n) {
  return p.__computed.timestamp > n.__computed.timestamp ? -1 : 1;
}

function extractFilters(sprints) {
  return [""].concat(sprints.map((s) => s.__computed.filterTag).filter((s, index, self) => self.indexOf(s) === index));
}

const StoreContext = createContext(null);

function storeReducer(state, action) {
  switch (action.type) {
    case "INIT": {
      return { ...state, ...action.state };
    }
    case "SELECT_FILTER": {
      state.selecteds.filter = state.selecteds.filter === action.filter ? "" : action.filter;
      return { ...state };
    }
    case "SELECT_SPRINT": {
      if (state.selecteds.sprint !== action.sprint) {
        state.selecteds.sprint = action.sprint;
        return { ...state };
      } else {
        return state;
      }
    }
    default: {
      throw new Error(`Unsupported action type: ${action.type}`);
    }
  }
}

export default function StoreProvider(props) {
  const [state, dispatch] = useReducer(storeReducer, { ...initialState });

  useEffect(() => {
    const s = {
      sprints: [],
      filters: [],
      page: 0,
      startAt: 0,
      isLast: false,
      pending: true
    };

    g();

    async function g() {
      const r = await getSprints(s.page);

      if (r && r.startAt >= s.startAt) {
        s.sprints = s.sprints.concat(r.values);
        s.page += 1;
        s.startAt = s.sprints.length;
        s.isLast = r.isLast;

        if (!s.isLast) {
          g();
        } else {
          s.pending = false;
          s.sprints = modify(s.sprints).sort(sortSprints);
          s.sprints[0].__computed.isCurrent = true;
          s.filters = extractFilters(s.sprints);

          dispatch({ type: "INIT", state: s });
        }
      }
    }
  }, []);

  const value = useMemo(() => [state, dispatch], [state]);

  return <StoreContext.Provider value={value} {...props} />;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }

  const [state, dispatch] = context;

  const selectFilter = useCallback(
    (filter = error("'filter' is missing!")) => {
      dispatch({ type: "SELECT_FILTER", filter });
    },
    [dispatch]
  );

  const selectSprint = useCallback(
    (sprint = error("'sprint' is missing!")) => {
      dispatch({ type: "SELECT_SPRINT", sprint });
    },
    [dispatch]
  );

  return {
    ...state,
    selectFilter,
    selectSprint
  };
}
