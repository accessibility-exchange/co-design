---
layout: layouts/updates
title: Updates
eleventyNavigation:
  key: Updates
  order: 2
permalink: "/updates/{% if pagination.pageNumber > 0 %}page/{{ pagination.pageNumber + 1 }}/{% endif %}"
pagination:
  data: collections.updates
  size: 10
  alias: updates
breadcrumbs: true
---
Coming soon!
