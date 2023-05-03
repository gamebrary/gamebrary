<template lang="html">
  <b-modal
    id="markdown-cheatsheet"
    scrollable
    hide-footer
    :header-bg-variant="darkTheme ? 'dark' : 'transparent'"
    :header-text-variant="darkTheme ? 'white' : 'dark'"
    :body-bg-variant="darkTheme ? 'dark' : 'transparent'"
    :body-text-variant="darkTheme ? 'white' : 'dark'"
  >
    <template v-slot:modal-header="{ close }">
      <modal-header
        title="Markdown syntax"
        subtitle="The simple and easy-to-use markup language"
        @close="close"
      />
    </template>

    <table class="table table-bordered small table-sm table-striped">
      <thead>
        <tr>
          <th>Element</th>
          <th>Markdown Syntax</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td><a href="/basic-syntax/#headings">Heading</a></td>
          <td><code># H1<br>
            ## H2<br>
            ### H3</code></td>
          </tr>
          <tr>
            <td><a href="/basic-syntax/#bold">Bold</a></td>
            <td><code>**bold text**</code></td>
          </tr>
          <tr>
            <td><a href="/basic-syntax/#italic">Italic</a></td>
            <td><code>*italicized text*</code></td>
          </tr>
          <tr>
            <td><a href="/basic-syntax/#blockquotes-1">Blockquote</a></td>
            <td><code>&gt; blockquote</code></td>
          </tr>
          <tr>
            <td><a href="/basic-syntax/#ordered-lists">Ordered List</a></td>
            <td><code>
              1. First item<br>
              2. Second item<br>
              3. Third item<br>
            </code></td>
          </tr>
          <tr>
            <td><a href="/basic-syntax/#unordered-lists">Unordered List</a></td>
            <td>
              <code>
                - First item<br>
                - Second item<br>
                - Third item<br>
              </code>
            </td>
          </tr>
          <tr>
            <td><a href="/basic-syntax/#code">Code</a></td>
            <td><code>`code`</code></td>
          </tr>
          <tr>
            <td><a href="/basic-syntax/#horizontal-rules">Horizontal Rule</a></td>
            <td><code>---</code></td>
          </tr>
          <tr>
            <td><a href="/basic-syntax/#links">Link</a></td>
            <td><code>[title](https://www.example.com)</code></td>
          </tr>
          <tr>
            <td><a href="/basic-syntax/#images-1">Image</a></td>
            <td><code>![alt text](image.jpg)</code></td>
          </tr>
        </tbody>
      </table>

      <h4>Extended Syntax</h4>

      <p>These elements extend the basic syntax by adding additional features. Not all Markdown applications support these elements.</p>

      <table class="table table-bordered small table-sm table-striped">
        <thead>
          <tr>
            <th>Element</th>
            <th>Markdown Syntax</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><a href="/extended-syntax/#tables">Table</a></td>
            <td><code>
              | Syntax      | Description |<br>
              | ----------- | ----------- |<br>
              | Header      | Title       |<br>
              | Paragraph   | Text        |
            </code></td>
          </tr>
          <tr>
            <td><a href="/extended-syntax/#fenced-code-blocks">Fenced Code Block</a></td>
            <td><code>```<br>
              {<br>
                &nbsp;&nbsp;"firstName": "John",<br>
                &nbsp;&nbsp;"lastName": "Smith",<br>
                &nbsp;&nbsp;"age": 25<br>
              }<br>
              ```
            </code></td>
          </tr>
          <tr>
            <td><a href="/extended-syntax/#footnotes">Footnote</a></td>
            <td><code>
              Here's a sentence with a footnote. [^1]<br><br>
              [^1]: This is the footnote.
            </code></td>
          </tr>
          <tr>
            <td><a href="/extended-syntax/#heading-ids">Heading ID</a></td>
            <td><code>### My Great Heading {#custom-id}</code></td>
          </tr>
          <tr>
            <td><a href="/extended-syntax/#definition-lists">Definition List</a></td>
            <td><code>
              term<br>
              : definition
            </code></td>
          </tr>
          <tr>
            <td><a href="/extended-syntax/#strikethrough">Strikethrough</a></td>
            <td><code>~~The world is flat.~~</code></td>
          </tr>
          <tr>
            <td><a href="/extended-syntax/#task-lists">Task List</a></td>
            <td><code>
              - [x] Write the press release<br>
              - [ ] Update the website<br>
              - [ ] Contact the media
            </code></td>
          </tr>
          <tr>
            <td><a href="/extended-syntax/#emoji">Emoji</a><br>(see also <a href="/extended-syntax/#copying-and-pasting-emoji">Copying and Pasting Emoji</a>)</td>
            <td><code>
              That is so funny! :joy:
            </code></td>
          </tr>
          <tr>
            <td><a href="/extended-syntax/#highlight">Highlight</a></td>
            <td><code>
              I need to highlight these ==very important words==.
            </code></td>
          </tr>
          <tr>
            <td><a href="/extended-syntax/#subscript">Subscript</a></td>
            <td><code>
              H~2~O
            </code></td>
          </tr>
          <tr>
            <td><a href="/extended-syntax/#superscript">Superscript</a></td>
            <td><code>
              X^2^
            </code></td>
          </tr>
        </tbody>
      </table>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['darkTheme']),
  },
}
</script>
