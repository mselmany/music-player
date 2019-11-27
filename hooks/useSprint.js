import React, { useEffect, useState, useCallback } from "react";
// import axios from "axios";
import { format, differenceInBusinessDays } from "date-fns";
import { tr } from "date-fns/locale";

import { getSprints } from "../mock";

export default function useSprints(_page = 0) {
  const [sprints, setSprints] = useState([]);
  const [startAt, setStartAt] = useState(0);
  const [page, setPage] = useState(_page);
  const [isLast, setIsLast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("");

  useEffect(() => {
    console.log("async function g()");
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
          s.loading = false;

          const _sprints = modify(s.sprints).sort(sortSprints);
          setSprints(_sprints);
          setFilters(extractFilters(_sprints));
          setPage(s.page);
          setStartAt(s.startAt);
          setIsLast(s.isLast);
          setLoading(s.loading);
        }
      }
    }

    const s = {
      sprints: [],
      page: 0,
      startAt: 0,
      isLast: false,
      loading: true
    };
    g();
  }, []);

  const selectFilter = useCallback((tag) => {
    console.log("selectFilter");
    setSelectedFilter((f) => (f === tag ? "" : tag));
  }, []);

  /*   useEffect(() => {
    console.log("selectedFilter");
    setSprints((s) =>
      s.map((item) => {
        item.__computed.showing = selectedFilter ? item.__computed.filterTag === selectedFilter : true;
        return item;
      })
    );
  }, [selectedFilter]); */

  const selectSprint = useCallback((sprintId) => {
    console.log("selectSprint");
    setSelectedSprint(sprintId);
  }, []);

  return { loading, sprints, selectSprint, startAt, isLast, filters, selectFilter, selectedFilter, selectedSprint };
}

function modify(sprints) {
  console.log("modify");
  return sprints.map((item) => {
    const lastDate = item.completeDate || item.endDate;
    item.__computed = {
      showing: true,
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
  console.log("sortSprints");
  return p.__computed.timestamp > n.__computed.timestamp ? -1 : 1;
}

function extractFilters(sprints) {
  console.log("extractFilters");
  return [""].concat(sprints.map((s) => s.__computed.filterTag).filter((s, index, self) => self.indexOf(s) === index));
}
