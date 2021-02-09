---
title: Sessions
eleventyNavigation:
    key: Sessions
    order: 3
permalink: "/sessions/{% if pagination.pageNumber > 0 %}page/{{ pagination.pageNumber + 1 }}/{% endif %}"
pagination:
  data: collections.sessions
  size: 10
  alias: sessions
layout: layouts/sessions
breadcrumbs: true
---
