import React, { PureComponent } from 'react';
import * as BizCharts from 'bizcharts';
import resizeMe from '@/decorator/resizeMe';
const { Chart } = BizCharts;

/**
 * Rewrite the Chart of BizCharts, the main purpose is to pass in the external size
 * BizCharts has encapsulated g2 very well. The best way to use it is not to reinvent the wheel, but to quickly use the examples on the official website and display them perfectly in our framework.
 * Therefore, we did not create new components such as Bar, Line, and Pie, increasing the cost of using and learning :)
 */
@resizeMe({ refreshRate: 50 })
class Charts extends PureComponent {
  onGetG2Instance = chart => {
    this.chart = chart;
  }

  render() {
    const { size, children, ...otherProps } = this.props;
    const { width, height } = size;

    return (
      <Chart 
        height={height} 
        width={width} 
        padding={'auto'} 
        {...otherProps}
        onGetG2Instance={(chart) => {
          this.chart = chart;
        }}
      >
        {children}
      </Chart>
    );
  }
}

BizCharts.Chart = Charts;
export default BizCharts;
