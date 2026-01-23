#!/bin/bash
# deploy/health-check.sh

# 健康检查端点
curl -f http://localhost:80/health || exit 1

# 检查磁盘空间
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 90 ]; then
  echo "磁盘空间不足: ${DISK_USAGE}%"
  exit 1
fi

# 检查内存使用
MEM_USAGE=$(free | awk '/Mem:/ {print int($3/$2*100)}')
if [ $MEM_USAGE -gt 90 ]; then
  echo "内存使用过高: ${MEM_USAGE}%"
  exit 1
fi

exit 0