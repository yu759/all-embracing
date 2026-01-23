````markdown
```mermaid
graph TB
    %% 太阳在最上方
    SUN["☀️"]

    %% 阳光从上到下
    RAYS["▼▼▼▼▼"]

    %% 向日葵在中间
    FLOWER["🌻"]

    %% 茎
    STEM["│<br>│<br>│<br>│"]

    %% 叶和地
    LEAVES["╱  ╲"]
    GROUND["══════"]

    SUN --> RAYS
    RAYS --> FLOWER
    FLOWER --> STEM
    STEM --> LEAVES
    LEAVES --> GROUND

    classDef invisibleNode stroke-width:0,fill:none,color:black
    class SUN,RAYS,FLOWER,STEM,LEAVES,GROUND invisibleNode

    linkStyle default stroke:none
```
````
