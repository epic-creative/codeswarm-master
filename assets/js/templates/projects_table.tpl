<table class="datatable">
    <thead>
        <tr>
            <th class="center" width="75">Status</th>
            <th class="center" width="65">Build</th>
            <th>Project</th>
            <th class="center" width="60">Logs</th>
            {{#unless restricted}}
            <th class="center" width="75">Config</th>
            {{/unless}}
        </tr>
    </thead>
    <tbody>
    {{#each projects}}
    <tr>
        <td class="center status-col" data-status="{{id}}">

            <br>

            {{#compare state "failed" operator="==="}}
            <a href="#/{{id}}/{{last_build}}" title="Build Failing"><i class="fa fa-circle red"></i></a>
            {{/compare}}

            {{#compare state "passed" operator="==="}}
            <a href="#/{{id}}/builds/{{last_build}}" title="Build Passing"><i class="fa fa-circle green"></i></a>
            {{/compare}}

            {{#compare state "running" operator="==="}}
            <a href="#/{{id}}/builds/{{last_build}}" title="Processing"><i class="fa fa-refresh fa-circle yellow"></i></a>
            {{/compare}}

            {{#compare state undefined operator="==="}}
            <a title="No Builds"><i class="fa fa-circle"></i></a>
            {{/compare}}

        </td>
        <td class="center run-col" data-light="{{id}}">
            <br>
            <a class="project-run-build" data-project="{{this.id}}"><i class="fa fa-repeat {{#compare this.state 'running' operator="==="}}fa-spin{{/compare}}"></i></a>
        </td>


        <td>
            {{#if this.view}}
            <h4 class="project"><a href="{{this.view}}">{{this.id}}</a></h4>
            {{else}}
            <h4 class="project">{{this.id}}</h4>
            {{/if}}
            <em class="repo">{{this.repo}}</em>
            <span class="last-build" data-timestamp="{{this.id}}">
                Last Build:
                {{#if this.ended_at}}
                  {{ended_at}}
                {{else}}
                  Never
                {{/if}}
            </span>

            <ul class="table-actions">
                <li>
                    {{#compare this.state "fail" operator="==="}}
                    <a href="#/logs/{{this.id}}/{{this.state.id}}" title="Build Failing"><i class="fa fa-circle red"></i></a>
                    {{/compare}}

                    {{#compare this.state "pass" operator="==="}}
                    <a href="#/logs/{{this.id}}/{{this.state.id}}" title="Build Passing"><i class="fa fa-circle green"></i></a>
                    {{/compare}}

                    {{#compare this.state "processing" operator="==="}}
                    <a href="#/logs/{{this.id}}/{{this.state.id}}" title="Processing"><i class="fa fa-refresh fa-circle yellow"></i></a>
                    {{/compare}}

                    {{#compare this.state undefined operator="==="}}
                    <a title="No Builds"><i class="fa fa-circle"></i></a>
                    {{/compare}}
                </li>
                <li>
                    <a class="project-run-build" data-project="{{this.id}}"><i class="fa fa-repeat"></i></a>
                </li>
                <li>
                    {{#if this.state}}
                    <a href="#/logs/{{this.id}}"><i class="fa fa-th-list"></i></a>
                    {{else}}
                    N/A
                    {{/if}}
                </li>
                <li>
                    <a href="#/{{this.id}}/config"><i class="fa fa-cog"></i></a>
                </li>
            </ul>
        </td>

        <td class="center logs-col">
            <br>
            {{#if this.state}}
            <a href="#/{{this.id}}/builds"><i class="fa fa-th-list"></i></a>
            {{else}}
            N/A
            {{/if}}
        </td>
        {{#unless ../restricted}}
        <td class="center settings-col">
            <br>
            <a href="#/{{this.id}}/config"><i class="fa fa-cog"></i></a>
        </td>
        {{/unless}}
    </tr>
    {{else}}
    <tr>
        {{#if search}}
            <td class="center" colspan="5"><br><br><em>No results.</em></td>
        {{else}}
            <td class="center" colspan="5"><br><br><em>No projects currently exist. <a href="#/project/new">Create One &raquo;</a></em><br><br></td>
        {{/if}}
    </tr>
    {{/each}}
    </tbody>
</table>